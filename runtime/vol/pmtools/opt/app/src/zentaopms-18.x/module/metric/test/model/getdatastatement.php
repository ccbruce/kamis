#!/usr/bin/env php
<?php

/**

title=getDataStatement
timeout=0
cid=1

- 测试count_of_bug @select t1.id from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )
- 测试count_of_annual_created_product @select t1.createddate from `zt_product` as t1  where t1.deleted  = '0' and  t1.shadow  = '0' and ( t1.vision like '%rnd%'  or t1.vision is null )
- 测试count_of_case_in_product @select t1.product from `zt_case` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )
- 测试count_of_annual_fixed_bug_in_product @select t1.product,t1.resolution,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )

- 测试count_of_daily_closed_bug_in_product @select t1.product,t1.status,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )

- 测试count_of_daily_closed_bug_in_product @ select t1.product,t1.status,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%lite%'  or t2.vision is null )

*/
include dirname(__FILE__, 5) . '/test/lib/init.php';
include dirname(__FILE__, 2) . '/calc.class.php';
su('admin');

$metric = new metricTest();

$metricList = array();
$metricList[0] = 'count_of_bug';
$metricList[1] = 'count_of_annual_created_product';
$metricList[2] = 'count_of_case_in_product';
$metricList[3] = 'count_of_annual_fixed_bug_in_product';
$metricList[4] = 'count_of_daily_closed_bug_in_product';

r($metric->getDataStatement($metricList[0], 'system',  'scale')) && p('') && e("select t1.id from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )");                                                        // 测试count_of_bug
r($metric->getDataStatement($metricList[1], 'system',  'scale')) && p('') && e("select t1.createddate from `zt_product` as t1  where t1.deleted  = '0' and  t1.shadow  = '0' and ( t1.vision like '%rnd%'  or t1.vision is null )");                                                                                               // 测试count_of_annual_created_product
r($metric->getDataStatement($metricList[2], 'product', 'scale')) && p('') && e("select t1.product from `zt_case` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )");                            // 测试count_of_case_in_product
r($metric->getDataStatement($metricList[3], 'product', 'scale')) && p('') && e("select t1.product,t1.resolution,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )"); // 测试count_of_annual_fixed_bug_in_product
r($metric->getDataStatement($metricList[4], 'product', 'scale')) && p('') && e("select t1.product,t1.status,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%rnd%'  or t2.vision is null )");     // 测试count_of_daily_closed_bug_in_product

r($metric->getDataStatement($metricList[4], 'product', 'scale', 'statement', 'lite')) && p('') && e(" select t1.product,t1.status,t1.closeddate from `zt_bug` as t1  left join `zt_product` as t2  on t1.product=t2.id  where t1.deleted  = '0' and  t2.deleted  = '0' and  t2.shadow  = '0' and ( t2.vision like '%lite%'  or t2.vision is null )"); // 测试count_of_daily_closed_bug_in_product