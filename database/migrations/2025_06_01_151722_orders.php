<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('compagnes')->onDelete('cascade');
            $table->string('from_country');
            $table->string('to_country');
            $table->float('weight');
            $table->float('estimated_price');
            $table->string('transport_type');
            $table->string('recipient_name');
            $table->string('payment_method');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // utilisateur connecté
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
