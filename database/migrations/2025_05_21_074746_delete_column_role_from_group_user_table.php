<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('group_user', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    public function down()
    {
        Schema::table('group_user', function (Blueprint $table) {
            $table->enum('role', ['owner', 'editor', 'viewer'])->default('viewer');
        });
    }


};
