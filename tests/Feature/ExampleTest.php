<?php

it('redirects to login page', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});
