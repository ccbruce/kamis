<?php
declare(strict_types=1);
/**
 * The recalculatesetting view file of metric module of ZenTaoPMS.
 *
 * @copyright   Copyright 2009-2023 禅道软件（青岛）有限公司(ZenTao Software (Qingdao) Co., Ltd. www.zentao.net)
 * @license     ZPL(https://zpl.pub/page/zplv12.html) or AGPL(https://www.gnu.org/licenses/agpl-3.0.en.html)
 * @author      Xin Zhou <zhouxin@easycorp.ltd>
 * @package     metric
 * @link        https://www.zentao.net
 */
namespace zin;

detailHeader
(
    to::title
    (
        entityLabel
        (
            setClass('text-xl font-black'),
            set::level(1),
            set::text($lang->metric->setting)
        )
    )
);
div
(
    setClass('alert secondary'),
    div
    (
        setClass('alert text bg-secondary'),
        $lang->metric->tips->noticeRecalculateConfig,
    )
);

formPanel
(
    formGroup
    (
        setClass('mt-5'),
        checkbox
        (
            setClass('isCalcAll'),
            set::name('isCalcAll'),
            set::checked(false),
            set::text($lang->metric->recalculateAll)
        ),
        div
        (
            $lang->metric->tips->noticeRewriteHistoryLib
        )
    ),
    set::actions(array()),
    div
    (
        setClass('form-actions'),
        btn
        (
            setClass('btn btn-primary'),
            bind::click("window.showRecalculateProgress('$calcRange', '$code')"),
            $lang->metric->startRecalculate
        ),
        btn
        (
            setClass('btn'),
            bind::click("window.closeModal()"),
            $lang->cancel
        )
    ),
);
