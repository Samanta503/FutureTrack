<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // Log the exception
        \Log::error('Exception in API request', [
            'message' => $exception->getMessage(),
            'exception' => $exception,
            'trace' => $exception->getTraceAsString()
        ]);

        if ($exception instanceof BadRequestException) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 400);
        }

        // In debug mode, show full details
        if (config('app.debug')) {
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage(),
                'exception' => class_basename($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => collect($exception->getTrace())->map(function($trace) {
                    return $trace['file'] . ':' . $trace['line'];
                })
            ], 500);
        }

        // Default response for unexpected exceptions
        return response()->json([
            'error' => true,
            'message' => 'An unexpected error occurred',
        ], 500);

    }

}
