<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Order
 * 
 * @property int $id
 * @property Carbon $date
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $user_id
 * @property bool|null $email_send
 * 
 * @property User|null $user
 * @property Collection|Menu[] $menus
 *
 * @package App\Models
 */
class Order extends Model
{
	protected $table = 'orders';

	protected $casts = [
		'date' => 'datetime',
		'deleted' => 'bool',
		'user_id' => 'int',
		'email_send' => 'bool'
	];

	protected $fillable = [
		'date',
		'deleted',
		'user_id',
		'email_send'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function menus()
	{
		return $this->belongsToMany(Menu::class, 'order_menus')
					->withPivot('id', 'remark', 'pricing', 'quantity', 'date', 'article_not_retrieved', 'deleted')
					->withTimestamps();
	}
}
