<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $id
 * @property string $title
 * @property string $title_en
 * @property int $order
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $supplier_id
 * 
 * @property Supplier|null $supplier
 * @property Collection|Menu[] $menus
 *
 * @package App\Models
 */
class Category extends Model
{
	protected $table = 'categories';

	protected $casts = [
		'order' => 'int',
		'deleted' => 'bool',
		'supplier_id' => 'int'
	];

	protected $fillable = [
		'title',
		'title_en',
		'order',
		'deleted',
		'supplier_id'
	];

	public function supplier()
	{
		return $this->belongsTo(Supplier::class);
	}

	public function menus()
	{
		return $this->hasMany(Menu::class);
	}
}
