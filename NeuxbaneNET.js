var Jimp = require('jimp'); // npm i jimp, to get pixel from an image.



class NeuxbaneNet {
    constructor(algorithm=(create)=>{}){
        this.dataCore = {};
        var create = {};

        /*Create an input image
        ex. our image has RGBA value and the resolution is 32x32

        R = [255,79,45,0,0,...] Channels 1 (32x32)
        G = [100,74,0,3,56,...] Channels 2 (32x32)
        B = [245,89,69,100,56,...] Channels 3 (32x32)
        A = [157,100,255,255,255,...] Channels 4 (32x32)
        and so on

        w is width and h is height
        create.inputImage([32,32,4],[R,G,B,A]);
        the inputImage size is 32x32x4
        */
        create.InputImage = (resolution=[32,32,4],channels)=>{
            console.log(resolution,channels);
        };

        /* Create a Filter layer
        Size of a filter/kernel cannot be larger than input.

        ex. Input size 32x32
        Filter size can be 3x3, 4x4, 5x5, ... 32x32.

        I want a filter with size 10x10 with 3 channels
        so I can write create.Filter([10,10,3])
        */
        create.FilterLayer = (size=[10,10,1])=>{
            console.log(size)
        };

        /* Create a pooling layer
        Downscale to another size
        */
        create.Pooling = (type="MAX",size=[2,2])=>{
            console.log(type,size);
        }
        
        algorithm(create);
    }
}

var e = new NeuxbaneNet((create)=>{
    var TRAINING_DATA_SETS=[];
    create.InputImage([2,2,1],TRAINING_DATA_SETS[0]);

    create.Filter([1,1]);
});
