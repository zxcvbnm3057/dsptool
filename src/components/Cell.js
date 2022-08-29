import Box from '@mui/material/Box';
import * as React from 'react';
import { useSelector } from 'react-redux';

const Cell = ({ name, onClick }) => {
    var requireNumber = useSelector((state) => state.requireData?.[name]?.n ?? 0)
    var machineNumber = useSelector((state) => state.requireData?.[name]?.m ?? 0)
    return (<Box sx={{
        width: 50, height: 50, border: "2px solid black !important",
        padding: "2px !important", cursor: "pointer"
    }} onClick={onClick} >
        <div style={{ position: 'relative', margin: '5px' }}>
            {name ?
                <>
                    <img alt={name} src={"./static/images/" + name + ".png"} />
                    <div style={{ position: "absolute", top: "0", left: "0" }}>{requireNumber}</div>
                    <div style={{ position: "absolute", bottom: "0", left: "0" }}>{Math.round(machineNumber * 100) / 100}</div>
                </>
                :
                <>
                </>
            }

        </div>

    </Box>)
}

export default Cell;