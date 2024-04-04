<?php
$this->app->loadLang('project');
$this->app->loadLang('product');
$this->app->loadLang('execution');
$this->app->loadLang('stage');

$schema = new stdclass();

$schema->primaryTable = 'project';

$schema->tables = array();
$schema->tables['project']   = 'zt_project';

$schema->joins = array();

$schema->fields = array();
$schema->fields['id']          = array('type' => 'number', 'name' => $this->lang->project->id);
$schema->fields['name']        = array('type' => 'string', 'name' => $this->lang->project->name);
$schema->fields['code']        = array('type' => 'string', 'name' => $this->lang->project->code);
$schema->fields['model']       = array('type' => 'option', 'name' => $this->lang->project->model, 'options' => $this->lang->project->modelList);
$schema->fields['type']        = array('type' => 'option', 'name' => $this->lang->project->type, 'options' => $this->lang->project->dbTypeList);
$schema->fields['status']      = array('type' => 'option', 'name' => $this->lang->project->status, 'options' => $this->lang->project->statusList);
$schema->fields['desc']        = array('type' => 'string', 'name' => $this->lang->project->desc);
$schema->fields['begin']       = array('type' => 'date',   'name' => $this->lang->project->begin);
$schema->fields['end']         = array('type' => 'date',   'name' => $this->lang->project->end);
$schema->fields['PO']          = array('type' => 'user',   'name' => $this->lang->product->PO);
$schema->fields['PM']          = array('type' => 'user',   'name' => $this->lang->project->common . $this->lang->project->PM);
$schema->fields['QD']          = array('type' => 'user',   'name' => $this->lang->project->QD);
$schema->fields['RD']          = array('type' => 'user',   'name' => $this->lang->project->RD);
$schema->fields['openedBy']    = array('type' => 'user',   'name' => $this->lang->project->openedBy);
$schema->fields['openedDate']  = array('type' => 'date',   'name' => $this->lang->project->openedDate);
$schema->fields['realBegan']   = array('type' => 'date',   'name' => $this->lang->project->realBegan);
$schema->fields['realEnd']     = array('type' => 'date',   'name' => $this->lang->project->realEnd);
$schema->fields['closedBy']    = array('type' => 'user',   'name' => $this->lang->project->closedBy);
$schema->fields['closedDate']  = array('type' => 'date',   'name' => $this->lang->project->closedDate);
$schema->fields['acl']         = array('type' => 'option', 'name' => $this->lang->project->acl, 'options' => $this->lang->project->acls);
$schema->fields['lifetime']    = array('type' => 'option', 'name' => $this->lang->project->lifetime, 'options' => $this->lang->execution->lifeTimeList);
$schema->fields['attribute']   = array('type' => 'option', 'name' => $this->lang->project->attribute, 'options' => $this->lang->stage->typeList);
$schema->fields['multiple']    = array('type' => 'option', 'name' => $this->lang->project->multiple, 'options' => $this->lang->project->multipleList);

$schema->objects = array();
