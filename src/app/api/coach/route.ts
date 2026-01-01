import { NextRequest, NextResponse } from 'next/server';

// Mock team data
const teamData = {
  id: "team-1",
  name: "Lincoln HS Track & Field",
  code: "LHS-TF-2025",
  coachId: "coach-1",
  athleteCount: 42,
  coachCount: 3,
  createdAt: "2023-08-01",
};

// Mock athletes
const athletes = [
  {
    id: "u1",
    name: "Elias Bolt",
    email: "jaylen.t@school.edu",
    grade: 12,
    events: ["100m", "200m"],
    tier: "GODSPEED",
    group: "Sprints",
    status: "active",
    stats: { workoutsCompleted: 156, prsThisSeason: 5, streak: 14, completionRate: 98 },
  },
  {
    id: "u2",
    name: "Marcus Johnson",
    email: "marcus.j@school.edu",
    grade: 11,
    events: ["200m", "400m"],
    tier: "WORLD_CLASS",
    group: "Sprints",
    status: "active",
    stats: { workoutsCompleted: 142, prsThisSeason: 3, streak: 12, completionRate: 95 },
  },
];

// Mock assignments
const assignments = [
  {
    id: "a1",
    title: "6x200m Sprint Intervals",
    type: "workout",
    description: "Complete 6 reps of 200m at 90% effort",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: "group",
    targetGroup: "Sprints",
    status: "active",
    submissions: { total: 12, completed: 8, late: 1 },
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'team', 'athletes', 'assignments', 'analytics'

  if (type === 'team') {
    return NextResponse.json({ team: teamData });
  }

  if (type === 'athletes') {
    const group = searchParams.get('group');
    let filteredAthletes = athletes;
    if (group && group !== 'all') {
      filteredAthletes = athletes.filter(a => a.group.toLowerCase() === group.toLowerCase());
    }
    return NextResponse.json({ 
      total: filteredAthletes.length,
      athletes: filteredAthletes 
    });
  }

  if (type === 'assignments') {
    const status = searchParams.get('status');
    let filteredAssignments = assignments;
    if (status) {
      filteredAssignments = assignments.filter(a => a.status === status);
    }
    return NextResponse.json({
      total: filteredAssignments.length,
      assignments: filteredAssignments
    });
  }

  if (type === 'analytics') {
    return NextResponse.json({
      stats: {
        totalAthletes: 42,
        activeThisWeek: 38,
        avgCompletionRate: 87,
        totalPRsThisSeason: 156,
        avgTrainingLoad: 4200,
      },
      weeklyProgress: [
        { week: "Week 1", completionRate: 82, prs: 12 },
        { week: "Week 2", completionRate: 85, prs: 18 },
        { week: "Week 3", completionRate: 78, prs: 8 },
      ],
    });
  }

  // Return overview
  return NextResponse.json({
    team: teamData,
    athleteCount: athletes.length,
    activeAssignments: assignments.filter(a => a.status === 'active').length,
  });
}

// POST - Create assignment or invite athlete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_assignment') {
      const { title, type, description, dueDate, assignedTo, targetGroup, exercises } = body;
      
      if (!title || !type || !dueDate) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const assignment = {
        id: `assignment-${Date.now()}`,
        title,
        type,
        description,
        dueDate,
        assignedTo,
        targetGroup,
        exercises,
        status: 'active',
        submissions: { total: 0, completed: 0, late: 0 },
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        assignment,
        message: 'Assignment created successfully! 📋',
      });
    }

    if (action === 'invite_athletes') {
      const { emails, message } = body;
      
      if (!emails || emails.length === 0) {
        return NextResponse.json(
          { error: 'No emails provided' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        invitesSent: emails.length,
        message: `${emails.length} invitation(s) sent successfully! 📧`,
      });
    }

    if (action === 'post_announcement') {
      const { title, content, pinned } = body;
      
      if (!content) {
        return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
        );
      }

      const announcement = {
        id: `announcement-${Date.now()}`,
        title,
        content,
        pinned: pinned || false,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        announcement,
        message: 'Announcement posted! 📢',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
