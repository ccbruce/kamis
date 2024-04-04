#!/usr/bin/env php
<?php

/**

title=count_of_reviewing_feedback_in_user
timeout=0
cid=1

- 测试分组数。 @6
- 测试用户admin第0条的value属性 @4
- 测试用户user第0条的value属性 @2
- 测试用户dev第0条的value属性 @11
- 测试用户pm第0条的value属性 @6
- 测试不存在的用户 @0

*/
include dirname(__FILE__, 7) . '/test/lib/init.php';
include dirname(__FILE__, 4) . '/calc.class.php';

zdTable('product')->config('product_shadow', true, 4)->gen(10);
zdTable('feedback')->config('feedback', true, 4)->gen(1000);

$metric = new metricTest();
$calc   = $metric->calcMetric(__FILE__);

r(count($calc->getResult())) && p('') && e('6'); // 测试分组数。

r($calc->getResult(array('user' => 'admin')))    && p('0:value') && e('4');  // 测试用户admin
r($calc->getResult(array('user' => 'user')))     && p('0:value') && e('2');  // 测试用户user
r($calc->getResult(array('user' => 'dev')))      && p('0:value') && e('11'); // 测试用户dev
r($calc->getResult(array('user' => 'pm')))       && p('0:value') && e('6');  // 测试用户pm
r($calc->getResult(array('user' => 'notexist'))) && p('')        && e('0');  // 测试不存在的用户