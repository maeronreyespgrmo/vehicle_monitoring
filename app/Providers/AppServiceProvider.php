<?php

namespace App\Providers;

use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Process\Process;

class AppServiceProvider extends ServiceProvider
{
    private static ?Process $plateOcrProcess = null;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(CommandStarting::class, function (CommandStarting $event): void {
            if ($event->command !== 'serve' || ! $this->plateOcrIsEnabled()) {
                return;
            }

            $script = public_path('python/plate_no.py');

            if (! is_file($script)) {
                $event->output->writeln('<error>Plate OCR script was not found.</error>');

                return;
            }

            $python = env('PLATE_OCR_PYTHON', PHP_OS_FAMILY === 'Windows' ? 'python' : 'python3');

            try {
                self::$plateOcrProcess = new Process([$python, $script], base_path());
                self::$plateOcrProcess->setTimeout(null);
                self::$plateOcrProcess->disableOutput();
                self::$plateOcrProcess->start();

                $event->output->writeln('<info>Plate OCR server started on http://localhost:5000.</info>');
            } catch (\Throwable $exception) {
                self::$plateOcrProcess = null;
                $event->output->writeln('<error>Unable to start the Plate OCR server: '.$exception->getMessage().'</error>');
            }
        });

        Event::listen(CommandFinished::class, function (CommandFinished $event): void {
            if ($event->command === 'serve') {
                $this->stopPlateOcrProcess();
            }
        });

        register_shutdown_function(fn () => $this->stopPlateOcrProcess());
    }

    private function plateOcrIsEnabled(): bool
    {
        return filter_var(env('PLATE_OCR_ENABLED', true), FILTER_VALIDATE_BOOL);
    }

    private function stopPlateOcrProcess(): void
    {
        if (self::$plateOcrProcess?->isRunning()) {
            self::$plateOcrProcess->stop(2);
        }

        self::$plateOcrProcess = null;
    }
}
