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
        Schema::create('shipments', function (Blueprint $table) {
              $table->id();
                $table->unsignedBigInteger('company_id'); 
                $table->string('contact');
                $table->string('phone');
                $table->string('country_from');
                $table->string('country_to');
                $table->string('city_from');
                $table->string('city_to');
                $table->string('weight');
                $table->enum('service', ['express', 'economique', 'standard']);
                $table->enum('freight_type', ['aerien', 'maritime', 'routier', 'ferroviaire']);
                
                $table->timestamps();

                $table->foreign('company_id')->references('id')->on('compagnes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
