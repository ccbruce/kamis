#!/usr/bin/env php
<?php

/**

title=count_of_assigned_bug_in_user
timeout=0
cid=1

- 测试分组数。 @6
- 测试用户admin第0条的value属性 @13
- 测试用户user第0条的value属性 @26
- 测试用户test第0条的value属性 @65
- 测试用户dev第0条的value属性 @104
- 测试用户pm第0条的value属性 @91
- 测试用户po第0条的value属性 @13
- 测试不存在的用户第0条的value属性 @0

*/
include dirname(__FILE__, 7) . '/test/lib/init.php';
include dirname(__FILE__, 4) . '/calc.class.php';

zdTable('product')->config('product_shadow', true, 4)->gen(10);
zdTable('bug')->config('bug_resolution_status', true, 4)->gen(1000);

$metric = new metricTest();
$calc   = $metric->calcMetric(__FILE__);

r(count($calc->getResult())) && p('') && e('6'); // 测试分组数。

r($calc->getResult(array('user' => 'admin')))    && p('0:value') && e('13');  // 测试用户admin
r($calc->getResult(array('user' => 'user')))     && p('0:value') && e('26');  // 测试用户user
r($calc->getResult(array('user' => 'test')))     && p('0:value') && e('65');  // 测试用户test
r($calc->getResult(array('user' => 'dev')))      && p('0:value') && e('104'); // 测试用户dev
r($calc->getResult(array('user' => 'pm')))       && p('0:value') && e('91');  // 测试用户pm
r($calc->getResult(array('user' => 'po')))       && p('0:value') && e('13');  // 测试用户po
r($calc->getResult(array('user' => 'notexist'))) && p('0:value') && e('0');   // 测试不存在的用户