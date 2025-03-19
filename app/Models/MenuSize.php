<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MenuSize
 * 
 * @property int $id
 * @property string $title
 * @property string $title_en
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|Menu[] $menus
 * @property Collection|Extra[] $extras
 *
 * @package App\Models
 */
class MenuSize extends Model
{
	protected $table = 'menu_sizes';

	protected $casts = [
		'deleted' => 'bool'
	];

	protected $fillable = [
		'title',
		'title_en',
		'deleted'
	];

	public function menus()
	{
		return $this->hasMany(Menu::class);
	}

	public function extras()
	{
		return $this->hasMany(Extra::class);
	}
}
