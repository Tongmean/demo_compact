const dbconnect = require('../DbConnect');

const historyLogWip = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'wip'`, [id]);
        res.status(200).json({
            data:result.rows,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data:err,
            success:false
        })
    }
};
const historyLogFg = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'fg'`, [id]);
        res.status(200).json({
            data:result.rows,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data:err,
            success:false
        })
    }
};
const historyLogBom = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'bom'`, [id]);
        res.status(200).json({
            data:result.rows,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data:err,
            success:false
        })
    }
};
const historyLogDr = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbconnect.query(`SELECT * FROM update_log WHERE record_id = $1 AND table_name = 'drill'`, [id]);
        res.status(200).json({
            data:result.rows,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data:err,
            success:false
        })
    }
};

module.exports ={
    historyLogWip,
    historyLogFg,
    historyLogBom,
    historyLogDr
}