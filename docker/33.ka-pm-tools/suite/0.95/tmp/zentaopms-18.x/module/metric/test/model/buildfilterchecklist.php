#!/usr/bin/env php
<?php

/**

title=buildFilterCheckList
timeout=0
cid=1

- 测试filter1筛选器返回的选中数
 - 属性scope @1
 - 属性object @0
 - 属性purpose @0
- 测试filter2筛选器返回的选中数
 - 属性scope @0
 - 属性object @2
 - 属性purpose @0
- 测试filter3筛选器返回的选中数
 - 属性scope @0
 - 属性object @0
 - 属性purpose @2
- 测试filter4筛选器返回的选中数
 - 属性scope @2
 - 属性object @3
 - 属性purpose @2

*/
include dirname(__FILE__, 5) . '/test/lib/init.php';
include dirname(__FILE__, 2) . '/calc.class.php';

$metric = new metricTest();

$filters1 = array('scope' => array('system'));
$filters2 = array('object' => array('program', 'execution'));
$filters3 = array('purpose' => array('cost', 'scale'));
$filters4 = array('scope' => array('system', 'product'), 'object' => array('program', 'execution', 'bug'),  'purpose' => array('scale', 'cost'));

r($metric->buildFilterCheckList($filters1)) && p('scope,object,purpose') && e('1,0,0'); // 测试filter1筛选器返回的选中数
r($metric->buildFilterCheckList($filters2)) && p('scope,object,purpose') && e('0,2,0'); // 测试filter2筛选器返回的选中数
r($metric->buildFilterCheckList($filters3)) && p('scope,object,purpose') && e('0,0,2'); // 测试filter3筛选器返回的选中数
r($metric->buildFilterCheckList($filters4)) && p('scope,object,purpose') && e('2,3,2'); // 测试filter4筛选器返回的选中数