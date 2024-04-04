<?php
/**
 * 按项目统计的研发需求总数。
 * Count of story in project.
 *
 * 范围：project
 * 对象：story
 * 目的：scale
 * 度量名称：按项目统计的研发需求总数
 * 单位：个
 * 描述：按项目统计的研发需求总数是指项目中创建或关联的所有研发需求的数量，反映了项目的规模和复杂度，提供了关于需求管理、进度控制、资源规划、风险评估和质量控制的有用信息。
 * 定义：项目中研发需求个数求和;过滤已删除的研发需求;过滤已删除的项目;
 *
 * @copyright Copyright 2009-2023 禅道软件（青岛）有限公司(ZenTao Software (Qingdao) Co., Ltd. www.zentao.net)
 * @author    qixinzhi <qixinzhi@easycorp.ltd>
 * @package
 * @uses      func
 * @license   ZPL(https://zpl.pub/page/zplv12.html) or AGPL(https://www.gnu.org/licenses/agpl-3.0.en.html)
 * @Link      https://www.zentao.net
 */
class count_of_story_in_project extends baseCalc
{
    public $dataset = 'getDevStoriesWithProject';

    public $fieldList = array('t3.project');

    public $result = array();

    public function calculate($row)
    {
        $project = $row->project;
        if(!isset($this->result[$project])) $this->result[$project] = 0;
        $this->result[$project] += 1;
    }

    public function getResult($options = array())
    {
        $records = $this->getRecords(array('project', 'value'));
        return $this->filterByOptions($records, $options);
    }
}
