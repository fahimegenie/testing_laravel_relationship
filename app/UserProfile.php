<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserProfile extends Model
{


    protected $guarded = [];
    
    public function user() {
    	return $this->belongsTo('App\User');
    }
    // public function 
}
