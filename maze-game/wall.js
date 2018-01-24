const Wall = function (r, c, vertical) {
    this.r = r;
    this.c = c;
    this.vertical = vertical;

    this.getMazeCells = function () {
        let otherR = this.r;
        let otherC = this.c;
        if (this.vertical) {
            otherC--;
        } else {
            otherR--;
        }
        return [
            {
                r: otherR,
                c: otherC
            },
            {
                r: this.r,
                c: this.c
            }
        ]
    }
}
