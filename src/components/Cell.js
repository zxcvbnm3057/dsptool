import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { roundToFix2, unitsConversion } from '../utils/calculateUtil';

const Cell = ({ name, onClick }) => {
    const globalSetting = useSelector((state) => state.globalSetting, shallowEqual)

    var requireNumber = useSelector((state) => state.requireData?.[name]?.n ?? 0)
    var machineNumber = useSelector((state) => state.requireData?.[name]?.m ?? 0)
    return (<Box sx={{
        width: 50, height: 50, border: "2px solid black !important",
        padding: "2px !important", cursor: "pointer"
    }} onClick={name ? onClick : null} >
        {name ? <Tooltip title={name} placement="top" arrow>
            <div style={{ position: 'relative', margin: '5px' }}>
                <img alt={name} src={"./static/images/" + name + ".png"} />
                <div style={{ position: "absolute", top: "0", left: "0" }}>{unitsConversion(requireNumber, globalSetting)}</div>
                <div style={{ position: "absolute", bottom: "0", left: "0" }}>{roundToFix2(machineNumber)}</div>
            </div>
        </Tooltip>
            :
            <>
            </>}
    </Box>
    )
}

export default Cell;