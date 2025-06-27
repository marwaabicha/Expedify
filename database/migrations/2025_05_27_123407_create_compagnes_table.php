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
        Schema::create('compagnes', function (Blueprint $table) {
            $table->id();
        $table->string('company_name');
        $table->text('description');
        $table->string('logo_path')->nullable();
        $table->string('logo_url')->nullable();
        $table->decimal('min_order_value', 10, 2)->nullable();
        $table->json('delivery_country');
        $table->json('transport_methods')->nullable();
        $table->string('terms_path')->nullable();
        $table->json('payment_methods')->nullable();
        $table->string('email');
        $table->string('phone');
        $table->string('website')->nullable();
        $table->text('address')->nullable();
        $table->boolean('accepted_terms')->default(false);
        $table->boolean('accepted_privacy_policy')->default(false);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compagnes');
    }
};
