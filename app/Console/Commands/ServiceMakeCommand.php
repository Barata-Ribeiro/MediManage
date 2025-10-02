<?php

namespace App\Console\Commands;

use App\Console\Commands\Traits\ServiceProviderInjector;
use Illuminate\Console\GeneratorCommand;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Artisan;

class ServiceMakeCommand extends GeneratorCommand
{
    use ServiceProviderInjector;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Service class';

    /**
     * Execute the console command.
     * @throws FileNotFoundException
     */
    public function handle(): ?bool
    {
        $codeToAdd = "\n\t\t\$this->app->bind(\n" .
            "\t\t\t\\App\\Interfaces\\" . str_replace('/', '\\', $this->argument('name')) . "Interface::class,\n" .
            "\t\t\t\\App\\Services\\" . str_replace('/', '\\', $this->argument('name')) . "::class\n" .
            "\t\t);\n";

        $appServiceProviderFile = app_path('Providers/AppServiceProvider.php');

        $this->injectCodeToRegisterMethod($appServiceProviderFile, $codeToAdd);

        Artisan::call('make:interface', [
            'name' => $this->argument('name') . 'Interface'
        ]);
        return parent::handle();
    }

    /**
     * Get the stub file for the generator.
     *
     * @return string
     */
    protected function getStub(): string
    {
        return __DIR__ . '/stubs/service.stub';
    }

    /**
     * Execute the console command.
     *
     * @param $rootNamespace
     * @return string
     */
    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace . '\\Services';
    }
}
