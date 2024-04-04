#!/usr/bin/env php
<?php

/**

title=buildOperateMenu
timeout=0
cid=1

- 获取metric1返回值main的第0个元素第0条的icon属性 @ban-circle
- 获取metric2返回值suffix的第0个元素第0条的icon属性 @edit
- 获取metric3返回值suffix的第0个元素第0条的icon属性 @trash

*/
include dirname(__FILE__, 5) . '/test/lib/init.php';
include dirname(__FILE__, 2) . '/calc.class.php';

$metric = new metricTest();

$metricByCode = $metric->getByCode('count_of_program');
$metric1 = $metric->getByID($metricByCode->id);
$metric2 = json_decode(json_encode($metric1));
$metric2->stage = 'wait';
$metric3 = json_decode(json_encode($metric1));
$metric3->builtin = 0;

r($metric->buildOperateMenu($metric1, 'main')) && p('0:icon') && e('ban-circle'); // 获取metric1返回值main的第0个元素
r($metric->buildOperateMenu($metric2, 'suffix')) && p('0:icon') && e('edit');     // 获取metric2返回值suffix的第0个元素
r($metric->buildOperateMenu($metric3, 'suffix')) && p('0:icon') && e('trash');    // 获取metric3返回值suffix的第0个元素