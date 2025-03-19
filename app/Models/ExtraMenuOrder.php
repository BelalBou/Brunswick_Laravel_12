<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ExtraMenuOrder
 * 
 * @property int $id
 * @property float $pricing
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $extra_id
 * @property int|null $order_menu_id
 * 
 * @property Extra|null $extra
 * @property OrderMenu|null $order_menu
 *
 * @package App\Models
 */
class ExtraMenuOrder extends Model
{
	protected $table = 'extra_menu_orders';

	protected $casts = [
		'pricing' => 'float',
		'deleted' => 'bool',
		'extra_id' => 'int',
		'order_menu_id' => 'int'
	];

	protected $fillable = [
		'pricing',
		'deleted',
		'extra_id',
		'order_menu_id'
	];

	public function extra()
	{
		return $this->belongsTo(Extra::class);
	}

	public function order_menu()
	{
		return $this->belongsTo(OrderMenu::class);
	}
}
