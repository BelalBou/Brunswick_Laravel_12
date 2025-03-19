<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Menu
 * 
 * @property int $id
 * @property string $title
 * @property string $title_en
 * @property string|null $description
 * @property string|null $description_en
 * @property float $pricing
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $supplier_id
 * @property int|null $category_id
 * @property int|null $menu_size_id
 * @property string|null $picture
 * 
 * @property Supplier|null $supplier
 * @property Category|null $category
 * @property MenuSize|null $menu_size
 * @property Collection|Extra[] $extras
 * @property Collection|Order[] $orders
 * @property Collection|Allergy[] $allergies
 *
 * @package App\Models
 */
class Menu extends Model
{
	protected $table = 'menus';

	protected $casts = [
		'pricing' => 'float',
		'deleted' => 'bool',
		'supplier_id' => 'int',
		'category_id' => 'int',
		'menu_size_id' => 'int'
	];

	protected $fillable = [
		'title',
		'title_en',
		'description',
		'description_en',
		'pricing',
		'deleted',
		'supplier_id',
		'category_id',
		'menu_size_id',
		'picture'
	];

	public function supplier()
	{
		return $this->belongsTo(Supplier::class);
	}

	public function category()
	{
		return $this->belongsTo(Category::class);
	}

	public function menu_size()
	{
		return $this->belongsTo(MenuSize::class);
	}

	public function extras()
	{
		return $this->belongsToMany(Extra::class, 'extra_menus')
					->withPivot('deleted')
					->withTimestamps();
	}

	public function orders()
	{
		return $this->belongsToMany(Order::class, 'order_menus')
					->withPivot('id', 'remark', 'pricing', 'quantity', 'date', 'article_not_retrieved', 'deleted')
					->withTimestamps();
	}

	public function allergies()
	{
		return $this->belongsToMany(Allergy::class, 'allergy_menus')
					->withPivot('deleted')
					->withTimestamps();
	}
}
