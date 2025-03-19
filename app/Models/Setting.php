<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Setting
 * 
 * @property int $id
 * @property time without time zone $time_limit
 * @property string $start_period
 * @property string $end_period
 * @property string $email_order_cc
 * @property string $email_supplier_cc
 * @property string $email_vendor_cc
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Setting extends Model
{
	protected $table = 'settings';

	protected $casts = [
		'time_limit' => 'time without time zone'
	];

	protected $fillable = [
		'time_limit',
		'start_period',
		'end_period',
		'email_order_cc',
		'email_supplier_cc',
		'email_vendor_cc'
	];
}
