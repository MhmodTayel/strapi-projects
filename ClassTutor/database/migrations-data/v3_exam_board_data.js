module.exports = async () => {
    var examBoards = ['AQA', 'Edexcel', 'OCR', 'WJEC', 'Eduqas'];

    for (const examBoard of examBoards) {
        // check if the exam board already exists
        const examBoardExists = await strapi.entityService.findMany('api::exam-board.exam-board', {
            filters: {
                code: examBoard.toUpperCase()
            }
        });

        if (examBoardExists.length === 0) {
            await strapi.entityService.create('api::exam-board.exam-board', {
                data: {
                    name: examBoard,
                    code: examBoard.toUpperCase()
                }
            });
        }
    }
};
