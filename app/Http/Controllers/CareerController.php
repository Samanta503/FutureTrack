<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CareerController extends Controller
{
    public function health(): JsonResponse
    {
        $connected = false;
        $reason = null;

        try {
            DB::select('SELECT 1');
            $connected = true;
        } catch (\Throwable $e) {
            $connected = false;
            $reason = $e->getMessage();
        }

        return response()->json([
            'app' => 'futuretrack-laravel',
            'status' => $connected ? 'ok' : 'degraded',
            'db' => [
                'connected' => $connected,
                'reason' => $reason,
                'host' => config('database.connections.mysql.host'),
                'port' => config('database.connections.mysql.port'),
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function user(int $id): JsonResponse
    {
        $user = DB::table('users as u')
            ->leftJoin('profiles as p', 'p.user_id', '=', 'u.id')
            ->where('u.id', $id)
            ->select([
                'u.id',
                'u.full_name',
                'p.headline',
                'p.location',
                'p.education_summary',
                'p.experience_years',
                'p.career_interests',
                'p.about',
            ])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $skills = DB::table('profile_skills as ps')
            ->join('skills as s', 's.id', '=', 'ps.skill_id')
            ->where('ps.profile_id', function ($query) use ($id) {
                $query->from('profiles')->select('id')->where('user_id', $id)->limit(1);
            })
            ->orderBy('s.name')
            ->pluck('s.name')
            ->toArray();

        return response()->json([
            'id' => (int) $user->id,
            'fullName' => (string) $user->full_name,
            'title' => (string) ($user->headline ?? 'Career Learner'),
            'location' => (string) ($user->location ?? ''),
            'education' => (string) ($user->education_summary ?? ''),
            'experienceYears' => (float) ($user->experience_years ?? 0),
            'careerInterests' => $this->decodeJsonArray($user->career_interests),
            'skills' => array_values($skills),
            'bio' => (string) ($user->about ?? ''),
        ]);
    }

    public function jobs(): JsonResponse
    {
        $rows = DB::table('jobs as j')
            ->leftJoin('job_skills as js', 'js.job_id', '=', 'j.id')
            ->leftJoin('skills as s', 's.id', '=', 'js.skill_id')
            ->select([
                'j.id',
                'j.title',
                'j.company_name',
                'j.location',
                'j.domain',
                'j.experience_level',
                'j.salary_min',
                'j.salary_max',
                'j.description',
                'j.responsibilities',
                'j.benefits',
                DB::raw("GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR '||') as required_skills"),
            ])
            ->groupBy([
                'j.id',
                'j.title',
                'j.company_name',
                'j.location',
                'j.domain',
                'j.experience_level',
                'j.salary_min',
                'j.salary_max',
                'j.description',
                'j.responsibilities',
                'j.benefits',
            ])
            ->orderBy('j.id')
            ->get();

        $data = $rows->map(function ($row) {
            return [
                'id' => (int) $row->id,
                'title' => (string) $row->title,
                'company' => (string) $row->company_name,
                'location' => (string) $row->location,
                'domain' => (string) $row->domain,
                'experienceLevel' => (string) $row->experience_level,
                'requiredSkills' => $row->required_skills ? explode('||', (string) $row->required_skills) : [],
                'salaryRange' => $this->formatSalaryRange($row->salary_min, $row->salary_max),
                'summary' => (string) ($row->description ?? ''),
                'responsibilities' => $this->decodeJsonArray($row->responsibilities),
                'benefits' => $this->decodeJsonArray($row->benefits),
            ];
        })->values();

        return response()->json(['data' => $data]);
    }

    public function courses(): JsonResponse
    {
        $rows = DB::table('courses as c')
            ->leftJoin('course_skills as cs', 'cs.course_id', '=', 'c.id')
            ->leftJoin('skills as s', 's.id', '=', 'cs.skill_id')
            ->select([
                'c.id',
                'c.title',
                'c.provider',
                'c.domain',
                'c.category',
                'c.level',
                'c.duration_hours',
                DB::raw("GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR '||') as skills_covered"),
            ])
            ->groupBy([
                'c.id',
                'c.title',
                'c.provider',
                'c.domain',
                'c.category',
                'c.level',
                'c.duration_hours',
            ])
            ->orderBy('c.id')
            ->get();

        $data = $rows->map(function ($row) {
            return [
                'id' => (int) $row->id,
                'title' => (string) $row->title,
                'provider' => (string) $row->provider,
                'duration' => ((int) ($row->duration_hours ?? 0)) . ' hrs',
                'level' => (string) $row->level,
                'domain' => (string) $row->domain,
                'category' => (string) $row->category,
                'skillsCovered' => $row->skills_covered ? explode('||', (string) $row->skills_covered) : [],
                'rating' => 4.7,
            ];
        })->values();

        return response()->json(['data' => $data]);
    }

    public function recommendations(): JsonResponse
    {
        $userId = (int) request()->query('userId', 1);

        $data = DB::table('recommendations')
            ->where('user_id', $userId)
            ->orderByDesc('score')
            ->orderBy('id')
            ->get(['id', 'recommendation_type', 'title', 'reason'])
            ->map(function ($row) {
                return [
                    'id' => (int) $row->id,
                    'type' => (string) $row->recommendation_type,
                    'title' => (string) $row->title,
                    'reason' => (string) ($row->reason ?? ''),
                ];
            })
            ->values();

        return response()->json(['data' => $data]);
    }

    private function decodeJsonArray(mixed $value): array
    {
        if (!$value) {
            return [];
        }

        if (is_array($value)) {
            return array_values($value);
        }

        $decoded = json_decode((string) $value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return array_values($decoded);
        }

        return [];
    }

    private function formatSalaryRange(mixed $min, mixed $max): string
    {
        if (!$min && !$max) {
            return 'Competitive';
        }

        if ($min && $max) {
            return 'INR ' . number_format((int) $min) . ' - INR ' . number_format((int) $max);
        }

        if ($min) {
            return 'From INR ' . number_format((int) $min);
        }

        return 'Up to INR ' . number_format((int) $max);
    }
}
