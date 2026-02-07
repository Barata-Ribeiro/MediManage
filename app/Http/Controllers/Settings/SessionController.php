<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Asika\Agent\Agent;
use Auth;
use Carbon\Carbon;
use DB;
use Exception;
use Inertia\Inertia;
use Log;

class SessionController extends Controller
{
    /**
     * Display a listing of the user's active sessions.
     */
    public function index()
    {
        $rawSessions = DB::table(config('session.table'))
            ->distinct()
            ->select('id', 'user_id', 'ip_address', 'user_agent', 'last_activity')
            ->where('user_id', Auth::id())
            ->whereNotNull('user_id')
            ->orderBy('last_activity', 'desc')
            ->get();

        $sessions = $rawSessions->map(function ($session) {
            $session->is_current_device = $session->id === session()->getId();
            $session->last_activity_label = Carbon::createFromTimestamp($session->last_activity)->diffForHumans();
            $session->last_activity = Carbon::createFromTimestamp($session->last_activity)->toFormattedDateString();
            $session->user_agent = $this->formatUserAgent($session->user_agent);

            return $session;
        });

        return Inertia::render('settings/sessions', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Format the user agent string into a more readable format.
     */
    private function formatUserAgent(string $userAgent): string
    {
        $agent = new Agent;
        $agent->setUserAgent($userAgent);

        $browser = $agent->browser() ?: 'Unknown Browser';
        $version = $agent->version($browser) ?: '';
        $os = $agent->platform() ?: 'Unknown OS';
        $major = $version ? explode('.', $version)[0] : '';

        return trim($browser.($major ? " {$major}" : '')." / {$os}");
    }

    /**
     * Remove the specified session from storage.
     */
    public function destroy(string $session_id)
    {
        try {
            DB::table('sessions')
                ->where('id', $session_id)
                ->where('user_id', Auth::id())
                ->delete();

            return to_route('sessions.index')->with('success', 'Session terminated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to terminate session.', ['action_user_id' => Auth::id(), 'session_id' => $session_id, 'error' => $e->getMessage()]);

            return to_route('sessions.index')->with('error', 'Failed to terminate session.');
        }
    }
}
