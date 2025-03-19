<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Extra
 * 
 * @property int $id
 * @property string $title
 * @property float $pricing
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $supplier_id
 * @property int|null $menu_size_id
 * @property string|null $title_en
 * 
 * @property Supplier|null $supplier
 * @property MenuSize|null $menu_size
 * @property Collection|Menu[] $menus
 * @property Collection|ExtraMenuOrder[] $extra_menu_orders
 *
 * @package App\Models
 */
class Extra extends Model
{
	protected $table = 'extras';

	protected $casts = [
		'pricing' => 'float',
		'deleted' => 'bool',
		'supplier_id' => 'int',
		'menu_size_id' => 'int'
	];

	protected $fillable = [
		'title',
		'pricing',
		'deleted',
		'supplier_id',
		'menu_size_id',
		'title_en'
	];

	public function supplier()
	{
		return $this->belongsTo(Supplier::class);
	}

	public function menu_size()
	{
		return $this->belongsTo(MenuSize::class);
	}

	public function menus()
	{
		return $this->belongsToMany(Menu::class, 'extra_menus')
					->withPivot('deleted')
					->withTimestamps();
	}

	public function extra_menu_orders()
	{
		return $this->hasMany(ExtraMenuOrder::class);
	}
}
