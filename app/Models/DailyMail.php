<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class DailyMail
 * 
 * @property int $id
 * @property Carbon $date
 * @property bool $sent
 * @property string $error
 * @property bool $deleted
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class DailyMail extends Model
{
	protected $table = 'daily_mails';

	protected $casts = [
		'date' => 'datetime',
		'sent' => 'bool',
		'deleted' => 'bool'
	];

	protected $fillable = [
		'date',
		'sent',
		'error',
		'deleted'
	];
}
