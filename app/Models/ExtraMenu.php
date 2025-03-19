<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExtraMenu
 * 
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int $menu_id
 * @property int $extra_id
 * 
 * @property Menu $menu
 * @property Extra $extra
 *
 * @package App\Models
 */
class ExtraMenu extends Model
{
	protected $table = 'extra_menus';
	public $incrementing = false;

	protected $casts = [
		'deleted' => 'bool',
		'menu_id' => 'int',
		'extra_id' => 'int'
	];

	protected $fillable = [
		'deleted'
	];

	public function menu()
	{
		return $this->belongsTo(Menu::class);
	}

	public function extra()
	{
		return $this->belongsTo(Extra::class);
	}
}
