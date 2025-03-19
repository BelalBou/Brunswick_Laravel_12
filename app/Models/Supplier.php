<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Supplier
 * 
 * @property int $id
 * @property string $name
 * @property string $email_address
 * @property bool $for_vendor_only
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $away_start
 * @property Carbon|null $away_end
 * @property string|null $email_address2
 * @property string|null $email_address3
 * 
 * @property Collection|Menu[] $menus
 * @property Collection|Extra[] $extras
 * @property Collection|Category[] $categories
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Supplier extends Model
{
	protected $table = 'suppliers';

	protected $casts = [
		'for_vendor_only' => 'bool',
		'deleted' => 'bool',
		'away_start' => 'datetime',
		'away_end' => 'datetime'
	];

	protected $fillable = [
		'name',
		'email_address',
		'for_vendor_only',
		'deleted',
		'away_start',
		'away_end',
		'email_address2',
		'email_address3'
	];

	public function menus()
	{
		return $this->hasMany(Menu::class);
	}

	public function extras()
	{
		return $this->hasMany(Extra::class);
	}

	public function categories()
	{
		return $this->hasMany(Category::class);
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
