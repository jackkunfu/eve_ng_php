<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/templates/win.php
 *
 * win template for UNetLab.
 *
 * LICENSE:
 *
 * This file is part of UNetLab (Unified Networking Lab).
 *
 * UNetLab is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * UNetLab is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with UNetLab. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license http://www.gnu.org/licenses/gpl.html
 * @link http://www.unetlab.com/
 * @version 20151019
 */

$p['type'] = 'qemu';
$p['name'] = 'Win';
$p['icon'] = 'Desktop.png';
$p['cpu'] = 1;
$p['ram'] = 2048;
$p['ethernet'] = 1;
$p['console'] = 'vnc';
$p['qemu_arch'] = 'x86_64';
$p['qemu_version'] = '2.0.2';
$p['qemu_options'] = '-machine type=pc-1.0,accel=kvm -cpu qemu64,+fsgsbase -vga std -usbdevice tablet -boot order=dc';
?>
