<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class OrderMenu
 * 
 * @property int $id
 * @property string|null $remark
 * @property float $pricing
 * @property int $quantity
 * @property Carbon|null $date
 * @property bool $article_not_retrieved
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $order_id
 * @property int|null $menu_id
 * 
 * @property Order|null $order
 * @property Menu|null $menu
 * @property Collection|ExtraMenuOrder[] $extra_menu_orders
 *
 * @package App\Models
 */
class OrderMenu extends Model
{
	protected $table = 'order_menus';

	protected $casts = [
		'pricing' => 'float',
		'quantity' => 'int',
		'date' => 'datetime',
		'article_not_retrieved' => 'bool',
		'deleted' => 'bool',
		'order_id' => 'int',
		'menu_id' => 'int'
	];

	protected $fillable = [
		'remark',
		'pricing',
		'quantity',
		'date',
		'article_not_retrieved',
		'deleted',
		'order_id',
		'menu_id'
	];

	public function order()
	{
		return $this->belongsTo(Order::class);
	}

	public function menu()
	{
		return $this->belongsTo(Menu::class);
	}

	public function extra_menu_orders()
	{
		return $this->hasMany(ExtraMenuOrder::class);
	}
}
