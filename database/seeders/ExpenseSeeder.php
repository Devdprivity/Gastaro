<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->error('No user found. Please create a user first.');
            return;
        }

        $expenses = [
            // Gastos detectados por voz
            [
                'user_id' => $user->id,
                'amount' => 45.50,
                'description' => 'Almuerzo en restaurante',
                'category' => 'Comida',
                'expense_date' => now()->subDays(1),
                'payment_method' => 'Tarjeta de crédito',
                'notes' => 'Comida con cliente',
                'detected_from' => 'voice',
                'raw_data' => [
                    'transcript' => 'gasté cuarenta y cinco pesos cincuenta en almuerzo',
                    'confidence' => 0.95,
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 150.00,
                'description' => 'Compra supermercado',
                'category' => 'Compras',
                'expense_date' => now()->subDays(2),
                'payment_method' => 'Débito',
                'notes' => null,
                'detected_from' => 'voice',
                'raw_data' => [
                    'transcript' => 'compré en el super por ciento cincuenta pesos',
                    'confidence' => 0.88,
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 25.00,
                'description' => 'Gasolina',
                'category' => 'Transporte',
                'expense_date' => now()->subDays(3),
                'payment_method' => 'Efectivo',
                'notes' => 'Llenado de tanque',
                'detected_from' => 'voice',
                'raw_data' => [
                    'transcript' => 'veinticinco pesos de gasolina',
                    'confidence' => 0.92,
                ],
            ],

            // Gastos detectados por OCR
            [
                'user_id' => $user->id,
                'amount' => 89.99,
                'description' => 'Compra en tienda departamental',
                'category' => 'Ropa',
                'expense_date' => now()->subDays(4),
                'payment_method' => 'Tarjeta de crédito',
                'notes' => 'Camisa y pantalón',
                'detected_from' => 'ocr',
                'raw_data' => [
                    'extracted_text' => 'COMPRA: $89.99\nTARJETA: ****1234\nFECHA: ' . now()->subDays(4)->format('d/m/Y'),
                    'confidence' => 0.87,
                    'bank' => 'BBVA',
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 320.00,
                'description' => 'Pago de servicios',
                'category' => 'Servicios',
                'expense_date' => now()->subDays(5),
                'payment_method' => 'Transferencia',
                'notes' => 'Luz y agua',
                'detected_from' => 'ocr',
                'raw_data' => [
                    'extracted_text' => 'CARGO: $320.00\nCONCEPTO: Servicios\nBANCO: Santander',
                    'confidence' => 0.91,
                    'bank' => 'Santander',
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 55.00,
                'description' => 'Farmacia',
                'category' => 'Salud',
                'expense_date' => now()->subDays(6),
                'payment_method' => 'Débito',
                'notes' => 'Medicamentos',
                'detected_from' => 'ocr',
                'raw_data' => [
                    'extracted_text' => 'DEBITO: $55.00\nCOMERCIO: Farmacia Guadalajara',
                    'confidence' => 0.93,
                    'bank' => 'HSBC',
                ],
            ],

            // Gastos ingresados manualmente
            [
                'user_id' => $user->id,
                'amount' => 180.00,
                'description' => 'Cena familiar',
                'category' => 'Comida',
                'expense_date' => now()->subDays(7),
                'payment_method' => 'Tarjeta de crédito',
                'notes' => 'Cumpleaños mamá',
                'detected_from' => 'manual',
                'raw_data' => null,
            ],
            [
                'user_id' => $user->id,
                'amount' => 450.00,
                'description' => 'Consulta médica',
                'category' => 'Salud',
                'expense_date' => now()->subDays(8),
                'payment_method' => 'Efectivo',
                'notes' => 'Dentista - limpieza',
                'detected_from' => 'manual',
                'raw_data' => null,
            ],
            [
                'user_id' => $user->id,
                'amount' => 75.50,
                'description' => 'Libros',
                'category' => 'Educación',
                'expense_date' => now()->subDays(9),
                'payment_method' => 'Tarjeta de débito',
                'notes' => 'Libro de programación',
                'detected_from' => 'manual',
                'raw_data' => null,
            ],
            [
                'user_id' => $user->id,
                'amount' => 1200.00,
                'description' => 'Renta mensual',
                'category' => 'Vivienda',
                'expense_date' => now()->subDays(10),
                'payment_method' => 'Transferencia',
                'notes' => 'Renta del departamento',
                'detected_from' => 'manual',
                'raw_data' => null,
            ],

            // Más gastos variados
            [
                'user_id' => $user->id,
                'amount' => 35.00,
                'description' => 'Uber',
                'category' => 'Transporte',
                'expense_date' => now(),
                'payment_method' => 'Tarjeta',
                'notes' => 'Viaje al centro',
                'detected_from' => 'notification',
                'raw_data' => [
                    'notification_text' => 'Tu viaje de $35.00 fue cobrado',
                    'app' => 'Uber',
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 120.00,
                'description' => 'Netflix',
                'category' => 'Entretenimiento',
                'expense_date' => now()->subDays(11),
                'payment_method' => 'Tarjeta de crédito',
                'notes' => 'Suscripción mensual',
                'detected_from' => 'ocr',
                'raw_data' => [
                    'extracted_text' => 'CARGO NETFLIX: $120.00',
                    'bank' => 'BBVA',
                ],
            ],
            [
                'user_id' => $user->id,
                'amount' => 65.00,
                'description' => 'Café y pastel',
                'category' => 'Comida',
                'expense_date' => now()->subHours(3),
                'payment_method' => 'Efectivo',
                'notes' => 'Starbucks',
                'detected_from' => 'voice',
                'raw_data' => [
                    'transcript' => 'gasté sesenta y cinco pesos en café',
                    'confidence' => 0.89,
                ],
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }

        $this->command->info('Expenses seeded successfully!');
        $this->command->info('Total expenses created: ' . count($expenses));
    }
}
