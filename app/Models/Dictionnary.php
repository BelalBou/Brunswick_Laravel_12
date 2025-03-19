<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Dictionnary
 * 
 * @property int $id
 * @property string $tag
 * @property string $translation_fr
 * @property string $translation_en
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Dictionnary extends Model
{
	protected $table = 'dictionnaries';

	protected $casts = [
		'deleted' => 'bool'
	];

	protected $fillable = [
		'tag',
		'translation_fr',
		'translation_en',
		'deleted'
	];
}
