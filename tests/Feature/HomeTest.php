<?php

use App\Models\Notice;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('home page can be rendered', function () {
    $response = $this->get(route('home'));
    $response->assertStatus(200);
});

test('gets redirected to dashboard when authenticated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('home'));

    $response->assertRedirect(route('dashboard'));
});

test('home page shares global props for guests', function () {
    $response = $this->get(route('home'));

    $response->assertInertia(fn (Assert $page) => $page
        ->has('name')
        ->has('quote.message')
        ->has('quote.author')
        ->has('auth')
        ->where('auth.user', null)
        ->has('sidebarOpen')
        ->has('flash')
        ->has('notices')
        ->has('latestArticles')
    );
});

test('about shares auth user when authenticated', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('about'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.id', $user->id)
        );
});

test('home page returns only active notices', function () {
    $response = $this->get(route('home'));

    $activeNotices = Notice::whereIsActive(true)->count();

    $response->assertInertia(fn (Assert $page) => $page
        ->has('notices', $activeNotices)
    );

    $notices = $response->inertiaProps('notices');
    $this->assertCount($activeNotices, $notices);
});

test('home page returns latest articles', function () {
    $response = $this->get(route('home'));

    $response->assertInertia(fn (Assert $page) => $page
        ->has('latestArticles', 3)
    );

    $articles = $response->inertiaProps('latestArticles');
    $this->assertCount(3, $articles);
});
