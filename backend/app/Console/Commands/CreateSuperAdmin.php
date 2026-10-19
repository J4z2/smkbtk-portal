<?php

namespace App\Console\Commands;

use App\Enums\Role;
use App\Models\AuditLog;
use App\Models\User;
use App\Support\OneTimePassword;
use Illuminate\Console\Command;

/**
 * First login on a new server: php artisan portal:create-super-admin you@example.com "Your Name"
 */
class CreateSuperAdmin extends Command
{
    protected $signature = 'portal:create-super-admin {email} {name}';

    protected $description = 'Create a super admin account and print a one-time password';

    public function handle(): int
    {
        $email = strtolower($this->argument('email'));
        if (User::withTrashed()->where('email', $email)->exists()) {
            $this->error("An account with {$email} already exists.");

            return self::FAILURE;
        }
        $password = OneTimePassword::generate(10);
        $user = User::create([
            'name' => $this->argument('name'),
            'role' => Role::SuperAdmin,
            'email' => $email,
            'password' => $password,
            'must_change_password' => true,
        ]);
        AuditLog::record('user.created_by_console', $user);

        $this->info("Super admin created: {$email}");
        $this->line("One-time password: {$password}");
        $this->line('You will be asked to change it at first login.');

        return self::SUCCESS;
    }
}
