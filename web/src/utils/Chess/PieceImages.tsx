type PiecesImagesType = {
	k: {
		w: string;
		b: string;
	};
	p: {
		w: string;
		b: string;
	};
	n: {
		w: string;
		b: string;
	};
	b: {
		w: string;
		b: string;
	};
	q: {
		w: string;
		b: string;
	};
	r: {
		w: string;
		b: string;
	};
};

const PiecesImages: PiecesImagesType = {
	k: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wk.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/bk.png",
	},
	p: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wp.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/bp.png",
	},
	n: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wn.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/bn.png",
	},
	b: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wb.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/bb.png",
	},
	r: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wr.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/br.png",
	},
	q: {
		w: "https://www.chess.com/chess-themes/pieces/neo/150/wq.png",
		b: "https://www.chess.com/chess-themes/pieces/neo/150/bq.png",
	},
};

export { PiecesImages, type PiecesImagesType };
