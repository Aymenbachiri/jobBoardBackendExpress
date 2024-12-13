import { jobSchema } from "@/lib/schema/validation";
import supabase from "@/lib/supabase/supabaseService";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Retrieve all jobs
 *     description: Returns a list of all job postings.
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       slug:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       locationType:
 *                         type: string
 *                       location:
 *                         type: string
 *                       description:
 *                         type: string
 *                       salary:
 *                         type: number
 *                       companyName:
 *                         type: string
 *                       applicationEmail:
 *                         type: string
 *                         format: email
 *                       applicationUrl:
 *                         type: string
 *                         format: uri
 *                       companyLogoUrl:
 *                         type: string
 *                         format: uri
 *                       approved:
 *                         type: boolean
 */
export async function GET() {
  try {
    const { data: jobs, error } = await supabase.from("jobs").select("*");
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     description: Adds a new job posting with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                       slug:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       location_type:
 *                         type: string
 *                       location:
 *                         type: string
 *                       description:
 *                         type: string
 *                       salary:
 *                         type: number
 *                       company_name:
 *                         type: string
 *                       application_email:
 *                         type: string
 *                         format: email
 *                       application_url:
 *                         type: string
 *                         format: uri
 *                       company_logo_url:
 *                         type: string
 *                         format: uri
 *                       approved:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *
 *     responses:
 *       201:
 *         description: Job created successfully.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedJob = jobSchema.safeParse(body);

    if (!validatedJob.success) {
      return NextResponse.json(
        { error: validatedJob.error.errors },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("jobs").insert(validatedJob.data);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json("job created successfully", { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
