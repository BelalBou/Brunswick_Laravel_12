<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SequelizeMetum
 * 
 * @property string $name
 *
 * @package App\Models
 */
class SequelizeMetum extends Model
{
	protected $table = 'SequelizeMeta';
	protected $primaryKey = 'name';
	public $incrementing = false;
	public $timestamps = false;
}
