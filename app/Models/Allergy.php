<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Allergy
 * 
 * @property int $id
 * @property string $description
 * @property string $description_en
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|Menu[] $menus
 *
 * @package App\Models
 */
class Allergy extends Model
{
	protected $table = 'allergies';

	protected $casts = [
		'deleted' => 'bool'
	];

	protected $fillable = [
		'description',
		'description_en',
		'deleted'
	];

	public function menus()
	{
		return $this->belongsToMany(Menu::class, 'allergy_menus')
					->withPivot('deleted')
					->withTimestamps();
	}
}
