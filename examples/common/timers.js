export class Timers {

    _timeouts_ = {}
    _timeout_ctr_ = 0
    _time = 0
    
    setTimeout(cb, ms){
        var ctr = this._timeout_ctr_++
        this._timeouts_[ctr] = [this._time+ms,cb]
        return ctr
    }
    
    update(deltaTime){
        this._time += (deltaTime*1000)
        for (var key in this._timeouts_) {
            var to = this._timeouts_[key]
            if(to[0] <= this._time){
                delete this._timeouts_[key]
                to[1]()
            }
        }
    }
}
