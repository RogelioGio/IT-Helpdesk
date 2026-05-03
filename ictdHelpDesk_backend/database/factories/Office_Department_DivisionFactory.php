<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Office_Department_Division>
 */
class Office_Department_DivisionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'officeCode'  => fake()->unique()->bothify('OFF-####'),
            'name'        => fake()->company() . ' Dept',
            'description' => fake()->sentence(),
        ];
    }
}
