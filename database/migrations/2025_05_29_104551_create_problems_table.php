<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::create('problems', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->enum('category', ['technical', 'billing', 'service', 'feature']);
    $table->enum('urgency', ['low', 'medium', 'high']);
    $table->json('attachments')->nullable(); 
    $table->string('status')->default('open'); 
    $table->timestamps();
});
    }

    public function down()
    {
        Schema::dropIfExists('problems');
    }
};
