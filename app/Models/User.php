<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 * 
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $language
 * @property string $type
 * @property string $email_address
 * @property string $password
 * @property bool $pending_registration
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $supplier_id
 * 
 * @property Supplier|null $supplier
 * @property Collection|Order[] $orders
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';

	protected $casts = [
		'pending_registration' => 'bool',
		'deleted' => 'bool',
		'supplier_id' => 'int'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'first_name',
		'last_name',
		'language',
		'type',
		'email_address',
		'password',
		'pending_registration',
		'deleted',
		'supplier_id'
	];

	public function supplier()
	{
		return $this->belongsTo(Supplier::class);
	}

	public function orders()
	{
		return $this->hasMany(Order::class);
	}
}
