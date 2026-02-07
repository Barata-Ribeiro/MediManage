<?php

namespace App\Console\Commands;

use App\Console\Commands\Traits\ServiceProviderInjector;
use Illuminate\Console\GeneratorCommand;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Artisan;

class RepositoryMakeCommand extends GeneratorCommand
{
    use ServiceProviderInjector;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:repository {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Repository class';

    /**
     * Execute the console command.
     *
     * @throws FileNotFoundException
     */
    public function handle(): ?bool
    {
        $codeToAdd = "\n\t\t\$this->app->bind(\n".
            "\t\t\t\\App\\Interfaces\\".str_replace('/', '\\', $this->argument('name'))."Interface::class,\n".
            "\t\t\t\\App\\Repositories\\".str_replace('/', '\\', $this->argument('name'))."::class\n".
            "\t\t);\n";

        $appServiceProviderFile = app_path('Providers/AppServiceProvider.php');

        $this->injectCodeToRegisterMethod($appServiceProviderFile, $codeToAdd);

        Artisan::call('make:interface', [
            'name' => $this->argument('name').'Interface',
        ]);

        return parent::handle();
    }

    /**
     * Get the stub file for the generator.
     */
    protected function getStub(): string
    {
        return __DIR__.'/stubs/repository.stub';
    }

    /**
     * Get the default namespace for the class.
     */
    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace.'\\Repositories';
    }
}
