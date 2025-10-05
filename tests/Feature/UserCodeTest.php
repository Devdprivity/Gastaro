<?php

use App\Models\User;
use App\Helpers\UserCodeGenerator;
use App\Http\Controllers\UserSearchController;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('user code is generated when creating new user', function () {
    $user = User::factory()->create([
        'user_code' => UserCodeGenerator::generateUniqueCode()
    ]);

    expect($user->user_code)->toHaveLength(8);
    expect($user->user_code)->toMatch('/^[A-Z0-9]+$/');
});

test('user codes are unique', function () {
    $code1 = UserCodeGenerator::generateUniqueCode();
    $code2 = UserCodeGenerator::generateUniqueCode();

    expect($code1)->not->toBe($code2);
});

test('can search user by code', function () {
    $user = User::factory()->create([
        'user_code' => 'ABC12345'
    ]);

    $this->actingAs($user);

    $response = $this->postJson('/user/search', [
        'code' => 'ABC12345'
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'user_code' => 'ABC12345'
            ]
        ]);
});

test('search returns 404 for non-existent user code', function () {
    $user = User::factory()->create([
        'user_code' => UserCodeGenerator::generateUniqueCode()
    ]);
    $this->actingAs($user);

    $response = $this->postJson('/user/search', [
        'code' => 'NONEXIST'
    ]);

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ]);
});

test('search validates code format', function () {
    $user = User::factory()->create([
        'user_code' => UserCodeGenerator::generateUniqueCode()
    ]);
    $this->actingAs($user);

    $response = $this->postJson('/user/search', [
        'code' => 'invalid'
    ]);

    $response->assertStatus(422);
});
