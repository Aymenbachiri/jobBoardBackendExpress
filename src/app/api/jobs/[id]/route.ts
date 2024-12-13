import { approveJobSchema } from "@/lib/schema/validation";
import supabase from "@/lib/supabase/supabaseService";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Retrieve details of a specific job by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 slug:
 *                   type: string
 *                 title:
 *                   type: string
 *                 type:
 *                   type: string
 *                 location_type:
 *                   type: string
 *                 location:
 *                   type: string
 *                 description:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 company_name:
 *                   type: string
 *                 application_email:
 *                   type: string
 *                 application_url:
 *                   type: string
 *                 company_logo_url:
 *                   type: string
 *                 approved:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *       404:
 *         description: Job not found.
 */
type Params = Promise<{ id: string }>;
export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Approve a job by ID
 *     description: Updates the `approved` status of a specific job to `true`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to approve.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approved:
 *                 type: boolean
 *                 enum: [true]
 *                 description: The approval status. Must be `true`.
 *             required:
 *               - approved
 *     responses:
 *       200:
 *         description: Job approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error or invalid request.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error.
 */

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const parseResult = approveJobSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors },
      { status: 400 }
    );
  }

  try {
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingJob) {
      return NextResponse.json(
        { error: `Job with ID ${id} not found` },
        { status: 404 }
      );
    }

    const updatedJob = {
      ...existingJob,
      approved: true,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("jobs")
      .update({ approved: true, updated_at: updatedJob.updated_at })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to approve job" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Job approved successfully", job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     description: Remove a specific job by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully.
 *       404:
 *         description: Job not found.
 */
export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Job deleted successfully" },
    { status: 200 }
  );
}
