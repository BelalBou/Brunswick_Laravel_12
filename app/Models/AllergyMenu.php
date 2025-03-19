<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AllergyMenu
 * 
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int $menu_id
 * @property int $allergy_id
 * 
 * @property Menu $menu
 * @property Allergy $allergy
 *
 * @package App\Models
 */
class AllergyMenu extends Model
{
	protected $table = 'allergy_menus';
	public $incrementing = false;

	protected $casts = [
		'deleted' => 'bool',
		'menu_id' => 'int',
		'allergy_id' => 'int'
	];

	protected $fillable = [
		'deleted'
	];

	public function menu()
	{
		return $this->belongsTo(Menu::class);
	}

	public function allergy()
	{
		return $this->belongsTo(Allergy::class);
	}
}
